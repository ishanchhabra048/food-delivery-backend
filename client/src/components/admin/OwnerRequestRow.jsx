import React, { useState } from "react";
import { Check, X, Clock, User, Mail } from "lucide-react";
import { StatusPill } from "../ui/StatusPill";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Textarea } from "../ui/Textarea";
import { formatDate } from "../../lib/utils";

export const OwnerRequestRow = ({
  request,
  onApprove,
  onReject,
  loading = false,
}) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!request) return null;

  const handleRejectConfirm = () => {
    onReject(request._id, rejectReason || "Request does not meet partner criteria");
    setRejectModalOpen(false);
  };

  const isPending = request.status === "PENDING";

  return (
    <>
      <div className="bg-surface rounded-xl border border-border p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-fg flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary" />
                {request.user?.fullName || "User"}
              </span>
              <span>•</span>
              <span className="text-xs text-fg-3 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {request.user?.email}
              </span>
            </div>
            <p className="text-[11px] text-fg-3 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Requested on {formatDate(request.createdAt)}
            </p>
          </div>

          <StatusPill status={request.status} />
        </div>

        {/* Message / Reason */}
        {request.reason && (
          <div className="p-3 bg-surface-muted rounded-lg text-xs text-fg-2">
            <span className="font-semibold text-fg">Applicant Note: </span>
            {request.reason}
          </div>
        )}

        {/* Action buttons if PENDING */}
        {isPending && (
          <div className="flex justify-end items-center gap-3 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRejectModalOpen(true)}
              className="text-danger hover:text-danger hover:bg-red-50 border-danger/30"
              iconLeft={X}
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onApprove(request._id)}
              loading={loading}
              iconLeft={Check}
            >
              Approve Partner
            </Button>
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Partner Request"
        description="Provide an optional reason why this application was rejected."
      >
        <div className="space-y-4 my-2">
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Incomplete restaurant business registration details"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleRejectConfirm}
              loading={loading}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
